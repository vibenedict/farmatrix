// FARMATRIX Traceability Smart Contract in Rust
// Framework: near-sdk 5.x (NEAR Protocol Testnet / Mainnet)

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use near_sdk::store::{LookupMap, Vector};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BatchRecord {
    pub batch_id: String,
    pub producer: AccountId,
    pub crop_name: String,
    pub quantity_kg: u64,
    pub harvest_timestamp: u64,
    pub quality_grade: String,
    pub data_hash: String, // SHA-256 canonical digest
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SupplyChainEvent {
    pub batch_id: String,
    pub actor: AccountId,
    pub event_type: String,
    pub location: String,
    pub timestamp: u64,
    pub data_hash: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct FarmatrixContract {
    pub admin: AccountId,
    pub batches: LookupMap<String, BatchRecord>,
    pub events: LookupMap<String, Vector<SupplyChainEvent>>,
}

#[near_bindgen]
impl FarmatrixContract {
    #[init]
    pub fn new() -> Self {
        Self {
            admin: env::predecessor_account_id(),
            batches: LookupMap::new(b"b"),
            events: LookupMap::new(b"e"),
        }
    }

    /// Register a unique harvest batch with SHA-256 commitment
    pub fn register_batch(
        &mut self,
        batch_id: String,
        crop_name: String,
        quantity_kg: u64,
        quality_grade: String,
        data_hash: String,
    ) {
        assert!(self.batches.get(&batch_id).is_none(), "Batch already registered");
        let record = BatchRecord {
            batch_id: batch_id.clone(),
            producer: env::predecessor_account_id(),
            crop_name,
            quantity_kg,
            harvest_timestamp: env::block_timestamp(),
            quality_grade,
            data_hash,
        };
        self.batches.insert(batch_id, record);
    }

    /// Record a supply chain event (storage, transport, audit, retail)
    pub fn record_event(
        &mut self,
        batch_id: String,
        event_type: String,
        location: String,
        data_hash: String,
    ) {
        assert!(self.batches.get(&batch_id).is_some(), "Batch does not exist");
        let event = SupplyChainEvent {
            batch_id: batch_id.clone(),
            actor: env::predecessor_account_id(),
            event_type,
            location,
            timestamp: env::block_timestamp(),
            data_hash,
        };
        let mut event_list = self.events.remove(&batch_id).unwrap_or_else(|| Vector::new(b"v"));
        event_list.push(event);
        self.events.insert(batch_id, event_list);
    }

    pub fn get_batch(&self, batch_id: String) -> Option<BatchRecord> {
        self.batches.get(&batch_id).cloned()
    }
}
