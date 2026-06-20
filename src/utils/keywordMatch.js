export const keywordMatch = (userInput, faqDataArray) => {
  const normalizedInput = userInput.toLowerCase();
  
  // Scans individual keywords arrays inside your structured records
  const foundEntry = faqDataArray.find(faq => 
    faq.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  return foundEntry 
    ? foundEntry.answer 
    : "I didn't quite catch that. Try asking about 'Alphonso variations', 'ripening instructions', or 'shipping delivery times'.";
};