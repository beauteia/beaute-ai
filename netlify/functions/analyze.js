const CATALOGUE = [
  {nom:"CeraVe Hydrating Cleanser",marque:"CeraVe",categorie:"Nettoyant",prix:"~15€"},
  {nom:"Toleriane Caring Wash",marque:"La Roche-Posay",categorie:"Nettoyant",prix:"~12€"},
  {nom:"CeraVe Moisturizing Cream",marque:"CeraVe",categorie:"Hydratant",prix:"~18€"},
  {nom:"Hydro Boost Water Gel",marque:"Neutrogena",categorie:"Hydratant",prix:"~20€"},
  {nom:"Toleriane Double Repair",marque:"La Roche-Posay",categorie:"Hydratant",prix:"~22€"},
  {nom:"Niacinamide 10% + Zinc 1%",marque:"The Ordinary",categorie:"Sérum",prix:"~6€"},
  {nom:"Hyaluronic Acid 2% + B5",marque:"The Ordinary",categorie:"Sérum",prix:"~7€"},
  {nom:"Minéral 89",marque:"Vichy",categorie:"Sérum",prix:"~25€"},
  {nom:"Anthelios SPF 50+",marque:"La Roche-Posay",categorie:"Protection solaire",prix:"~28€"},
  {nom:"Eye Repair Cream",marque:"CeraVe",categorie:"Contour des yeux",prix:"~19€"},
  {nom:"AHA 30% + BHA 2% Peeling Solution",marque:"The Ordinary",categorie:"Exfoliant",prix:"~8€"},
  {nom:"Skin Perfecting 2% BHA Liquid Exfoliant",marque:"Paula's Choice",categorie:"Exfoliant",prix:"~33€"},
  {nom:"Super Volcanic Pore Clay Mask",marque:"Innisfree",categorie:"Masque",prix:"~16€"},
  {nom:"Himalayan Charcoal Purifying Glow Mask",marque:"The Body Shop",categorie:"Masque",prix:"~20€"},
  {nom:"Healing Ointment",marque:"CeraVe",categorie:"Baume lèvres",prix:"~10€"}
];

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"}, body: "" };
  }
  try {
    const { image } = JSON.parse(event.body);
    const key = process.env.ANTHROPIC_KEY;
    const shuffled = [...CATALOGUE].sort(() => Math.random() - 0.5);
    const catalogueStr = JSON.stringify(shuffled);
    const prompt = `Tu es experte en dermatologie esthétique. Si l'image ne contient pas de visage humain clairement visible, retourne UNIQUEMENT: {"erreur":"Aucun visage détecté. Veuillez prendre une photo de face avec un bon éclairage."}. Sinon, analyse ce visage et choisis 4 à 6 produits UNIQUEMENT dans ce catalogue: ${catalogueStr}. Utilise exactement les valeurs nom, marque, categorie, prix du catalogue. Varie tes recommandations selon les besoins spécifiques détectés et ne propose pas systématiquement les mêmes produits. Retourne UNIQUEMENT un JSON valide sans markdown: {"profil":{"typePeau":"string","teint":"string","carnation":"string","particularites":["string"]},"analyse":"string","produits":[{"categorie":"string","nom":"string","marque":"string","raison":"string","prix":"string","score":0}],"routine":{"matin":["string"],"soir":["string"]},"conseil":"string"}`;
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
