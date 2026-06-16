async function ingestEvent(event) {

   await saveRawEvent(event);

   const facts = extractFacts(event);

   await saveFacts(facts);
}