# Blockchain / Integrity Layer — Architecture & Prompts

Hash-chain ledger, with optional Polygon Amoy testnet anchoring

---

## Architecture

### Why not a "real" blockchain node

Running Ethereum/Hyperledger infrastructure for a hackathon buoy network is expensive, slow to write to, and fragile to demo live. What you actually need to prove to judges is **immutability and tamper-evidence** — which is the core mechanism blockchains use, not the mining/consensus overhead. A hash-chain gives you that mechanism directly, for free, with instant writes.

### Block structure

```
Block {
  index          -- sequential position in the chain
  timestamp      -- server-side, not device-side (don't trust device clocks)
  data_hash      -- sha256(sensor_reading JSON)
  previous_hash  -- the hash of the block before this one
  hash           -- sha256(index + timestamp + data_hash + previous_hash)
}
```

Each block cryptographically depends on the one before it. Change any old record and its `data_hash` no longer matches — which changes its `hash` — which breaks every `previous_hash` reference after it. That's the whole tamper-evidence guarantee, and it's exactly what judges are picturing when they hear "blockchain."

### Write path

```
IoT reading arrives at /ingest
      │ (HMAC verified — see hardware file)
      ▼
Insert into sensor_readings
      │
      ▼
ledger service:
  1. fetch last block's hash as previous_hash
  2. data_hash = sha256(json of the new reading)
  3. hash = sha256(index + timestamp + data_hash + previous_hash)
  4. insert new block
```

### Verify path (the demo moment)

```
GET /ledger/verify
  walk every block from index 0
  recompute hash from stored (index, timestamp, data_hash, previous_hash)
  compare to stored hash
  → return "intact" or "tampered at block N"
```

This endpoint is your live demo: manually edit a row in the DB, hit `/ledger/verify`, show it catch the tamper and name the exact block.

### Optional: anchoring to Polygon Amoy (free Ethereum-compatible testnet)

To back up your pitch's "blockchain-verified" claim with an actual public chain, without paying gas on every single sensor reading:

```
Every N blocks (e.g. every 100 readings, or once per hour):
  1. Compute a single root hash over the batch (Merkle root, or just
     sha256 of the last block's hash — either is defensible for a demo)
  2. Send one transaction to a simple smart contract on Polygon Amoy
     storing that root hash + a batch ID
  3. Store the transaction hash alongside the batch in your DB
```

This keeps day-to-day writes on your fast local hash-chain, while periodically "notarizing" it on a real, free, public Ethereum-compatible chain — genuinely more credible than claiming full on-chain storage, and it won't stall your demo if the testnet is slow or down.

---

## Build prompts

### Ledger service prompt

```
Add a ledger service to my FastAPI backend for tamper-evident storage of IoT
sensor readings.

Model: LedgerBlock(index: int, timestamp: datetime, data_hash: str,
previous_hash: str, hash: str)

Function append_block(reading: SensorReading) -> LedgerBlock:
- fetch the most recent LedgerBlock (or use a fixed genesis hash "0"*64 if none exists)
- data_hash = sha256(json.dumps(reading fields, sort_keys=True)).hexdigest()
- new index = last index + 1 (or 0 for genesis)
- timestamp = datetime.utcnow()
- hash = sha256(f"{index}{timestamp}{data_hash}{previous_hash}").hexdigest()
- insert and return the new block

Function verify_chain() -> dict:
- walk all blocks in index order
- recompute each hash from its stored fields and compare to the stored hash
- also confirm each block's previous_hash matches the prior block's hash
- return {"status": "intact"} or {"status": "tampered", "at_block": index}

Wire append_block() to be called right after every successful /ingest write.
Expose GET /ledger/verify calling verify_chain().
```

### Polygon Amoy anchoring prompt (optional, do after the core ledger works)

```
Write a script that runs every N ledger blocks (configurable, default 100):
1. Take the hash of the most recent LedgerBlock as the batch root.
2. Connect to Polygon Amoy testnet via web3.py using a free RPC endpoint
   (e.g. Alchemy or a public Amoy RPC) and a funded testnet wallet (get free
   testnet MATIC from a faucet).
3. Call a minimal deployed smart contract's `anchor(bytes32 batchRoot, uint256 batchId)`
   function, or if no contract is deployed yet, send the root hash as calldata
   in a simple 0-value transaction to a known address.
4. Store the resulting transaction hash in a new AnchorBatch table
   (batch_id, root_hash, tx_hash, timestamp) so it can be shown/verified on
   PolygonScan (Amoy) during the demo.

Also write the minimal Solidity contract:
pragma solidity ^0.8.0;
contract Anchor {
    event Anchored(uint256 indexed batchId, bytes32 root);
    function anchor(bytes32 root, uint256 batchId) external {
        emit Anchored(batchId, root);
    }
}
```
