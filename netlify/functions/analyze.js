const CATALOGUE_SKINCARE = [
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
  {nom:"Healing Ointment",marque:"CeraVe",categorie:"Baume lèvres",prix:"~10€"},
  {nom:"Acne Pimple Master Patch",marque:"COSRX",categorie:"Patch anti-boutons",prix:"~9€"},
  {nom:"Mighty Patch Original",marque:"Hero Cosmetics",categorie:"Patch anti-boutons",prix:"~13€"},
  {nom:"Pure Konjac Sponge",marque:"The Body Shop",categorie:"Éponge nettoyante",prix:"~8€"},
  {nom:"Brosse nettoyante silicone visage",marque:"Générique",categorie:"Outil nettoyant",prix:"~12€"},
  {nom:"Filet moussant nettoyant visage",marque:"Générique",categorie:"Accessoire nettoyant",prix:"~5€"},
  {nom:"Rouleau de jade visage",marque:"Générique",categorie:"Outil massage",prix:"~14€"},
  {nom:"Gua Sha quartz rose",marque:"Générique",categorie:"Outil massage",prix:"~11€"},
  {nom:"Patchs yeux hydrogel",marque:"Garnier",categorie:"Soin yeux",prix:"~10€"},
  {nom:"Cotons démaquillants réutilisables bambou",marque:"Générique",categorie:"Accessoire démaquillage",prix:"~8€"},
  {nom:"Taie d'oreiller en satin",marque:"Générique",categorie:"Accessoire anti-acné",prix:"~15€"}
];

const CATALOGUE_MAKEUP = [
  {nom:"Accord Parfait Foundation",marque:"L'Oréal Paris",categorie:"Fond de teint",prix:"~15€"},
  {nom:"Fit Me Matte + Poreless Foundation",marque:"Maybelline",categorie:"Fond de teint",prix:"~13€"},
  {nom:"Healthy Mix Foundation",marque:"Bourjois",categorie:"Fond de teint",prix:"~14€"},
  {nom:"BB Cream 5-en-1",marque:"Garnier",categorie:"BB Cream",prix:"~10€"},
  {nom:"Infaillible 32H Matte Cover Foundation",marque:"L'Oréal Paris",categorie:"Fond de teint",prix:"~16€"},
  {nom:"Color Riche Lipstick",marque:"L'Oréal Paris",categorie:"Rouge à lèvres",prix:"~12€"},
  {nom:"Color Sensational Lipstick",marque:"Maybelline",categorie:"Rouge à lèvres",prix:"~11€"},
  {nom:"Soft Matte Lip Cream",marque:"NYX Professional",categorie:"Rouge à lèvres",prix:"~9€"},
  {nom:"Kate Lipstick",marque:"Rimmel",categorie:"Rouge à lèvres",prix:"~10€"},
  {nom:"La Petite Palette",marque:"L'Oréal Paris",categorie:"Fard à paupières",prix:"~14€"},
  {nom:"The City Mini Palette",marque:"Maybelline",categorie:"Fard à paupières",prix:"~13€"},
  {nom:"Ultimate Shadow Palette",marque:"NYX Professional",categorie:"Fard à paupières",prix:"~18€"},
  {nom:"Sky High Mascara",marque:"Maybelline",categorie:"Mascara",prix:"~12€"},
  {nom:"Telescopic Mascara",marque:"L'Oréal Paris",categorie:"Mascara",prix:"~14€"},
  {nom:"Lash Princess Mascara",marque:"Essence",categorie:"Mascara",prix:"~5€"},
  {nom:"Infaillible Concealer",marque:"L'Oréal Paris",categorie:"Correcteur",prix:"~12€"},
  {nom:"Fit Me Concealer",marque:"Maybelline",categorie:"Correcteur",prix:"~10€"},
  {nom:"True Match Blush",marque:"L'Oréal Paris",categorie:"Blush",prix:"~13€"},
  {nom:"Baked Blush",marque:"Milani",categorie:"Blush",prix:"~15€"},
  {nom:"Super Liner Perfect Slim",marque:"L'Oréal Paris",categorie:"Eyeliner",prix:"~11€"},
  {nom:"Infaillible 24H Setting Powder",marque:"L'Oréal Paris",categorie:"Poudre fixante",prix:"~14€"},
  {nom:"Stay Matte Pressed Powder",marque:"Rimmel",categorie:"Poudre fixante",prix:"~8€"},
  {nom:"True Match Highlighter",marque:"L'Oréal Paris",categorie:"Enlumineur",prix:"~14€"},
  {nom:"Dream Radiant Liquid Foundation",marque:"Maybelline",categorie:"Fond de teint",prix:"~12€"}
];

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"}, body: "" };
  }
  try {
    const { image, mode } = JSON.parse(event.body);
    const key = process.env.ANTHROPIC_KEY;
    const isMakeup = mode === "maquillage";
    const catalogue = isMakeup ? CATALOGUE_MAKEUP : CATALOGUE_SKINCARE;
    const shuffled = [...catalogue].sort(() => Math.random() - 0.5);
    const catalogueStr = JSON.stringify(shuffled);
    const erreur = '{"erreur":"Aucun visage détecté. Veuillez prendre une photo de face avec un bon éclairage."}';
    const jsonSchema = '{"profil":{"typePeau":"string","teint":"string","carnation":"string","particularites":["string"]},"analyse":"string","produits":[{"categorie":"string","nom":"string","marque":"string","raison":"string","prix":"string","score":0}],"routine":{"matin":["string"],"soir":["string"]},"conseil":"string"}';

    const prompt = isMakeup
      ? `Tu es experte en maquillage et colorimétrie. Si l'image ne contient pas de visage humain clairement visible, retourne UNIQUEMENT: ${erreur}. Sinon, analyse ce visage avec un regard professionnel et critique : identifie les irrégularités de teint, les zones à corriger, les imperfections à couvrir, les traits à rééquilibrer. Dans "analyse", sois directe sur ce qui nécessite une correction ou une mise en valeur. Choisis 4 à 6 produits maquillage UNIQUEMENT dans ce catalogue ORDONNÉS DU PLUS UTILE AU MOINS UTILE: ${catalogueStr}. Le score représente l'utilité (90-100=indispensable, 70-89=très recommandé, 50-69=recommandé). La raison doit expliquer quel défaut précis ce produit corrige ou quel atout il met en valeur. Adapte les teintes à la carnation détectée. Utilise exactement les valeurs nom, marque, categorie, prix du catalogue. Retourne UNIQUEMENT un JSON valide sans markdown: ${jsonSchema}`
      : `Tu es dermatologue experte. Si l'image ne contient pas de visage humain clairement visible, retourne UNIQUEMENT: ${erreur}. Sinon, analyse ce visage avec un regard clinique et identifie directement les problèmes cutanés visibles : pores dilatés, imperfections, zones sèches ou déshydratées, brillance excessive, cernes, rides naissantes, teint terne, etc. Dans "analyse", sois directe et précise sur les défauts constatés — ne minimise pas. Choisis 4 à 6 produits UNIQUEMENT dans ce catalogue ORDONNÉS DU PLUS URGENT AU MOINS URGENT: ${catalogueStr}. Le score représente l'urgence (90-100=indispensable immédiatement, 70-89=très recommandé, 50-69=recommandé). La raison doit expliquer quel problème précis ce produit corrige. Utilise exactement les valeurs nom, marque, categorie, prix du catalogue. Retourne UNIQUEMENT un JSON valide sans markdown: ${jsonSchema}`;

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
