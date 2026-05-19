exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"}, body: "" };
  }
  try {
    const { image } = JSON.parse(event.body);
    const key = process.env.ANTHROPIC_KEY;
    const prompt = "Tu es experte en dermatologie esthétique. Analyse ce visage et retourne UNIQUEMENT un JSON valide sans markdown: {\"profil\":{\"typePeau\":\"string\",\"teint\":\"string\",\"carnation\":\"string\",\"particularites\":[\"string\"]},\"analyse\":\"string\",\"produits\":[{\"categorie\":\"string\",\"nom\":\"string\",\"marque\":\"string\",\"raison\":\"string\",\"prix\":\"string\",\"score\":0}],\"routine\":{\"matin\":[\"string\"],\"soir\":[\"string\"]},\"conseil\":\"string\"}";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        messages: [{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:image}},{type:"text",text:prompt}]}]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const result = data.content[0].text;
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}, body: JSON.stringify({ result }) };
  } catch(e) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin":"*"}, body: JSON.stringify({ error: e.message }) };
  }
};
