function extractFacts(event) {

   const facts = [];

   const payload = event.payload;

   if (payload.plan) {
      facts.push({
         type: "plan",
         value: payload.plan
      });
   }

   if (payload.preference) {
      facts.push({
         type: "preference",
         value: payload.preference
      });
   }

   if (payload.affected_seats) {
      facts.push({
         type: "affected_seats",
         value: payload.affected_seats
      });
   }

   return facts;
}