exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"}, body: "" };
  }
  try {
    const { image } = JSON.parse(event.body);
    const key = process.env.GEMINI_KEY;
    const prompt = `Tu es experte en dermatologie. Retourne UNIQUEMENT ce JSON sans markdown: {"profil":{"typePeau":"string","teint":"string","carnation":"string","particularites":["string"]},"analyse":"string","produits":[{"categorie":"string","nom":"string","marque":"string","raison":"string","prix":"string","score":0}],"routine":{"matin":["string"],"soir":["string"]},"conseil":"string"}`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-preview-05-20:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"image/jpeg",data:image}},{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:3000}})});
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const result = data.candidates[0].content.parts[0].text;
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}, body: JSON.stringify({ result }) };
  } catch(e) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin":"*"}, body: JSON.stringify({ error: e.message }) };
  }
};
