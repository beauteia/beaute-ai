exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"},
      body: ""
    };
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    const { image } = JSON.parse(event.body);
    const key = process.env.GEMINI_KEY;
    const prompt = `Tu es experte en dermatologie esthétique. Analyse ce visage et retourne UNIQUEMENT un JSON valide sans markdown:\n{"profil":{"typePeau":"string","teint":"string","carnation":"string","particularites":["string","string"]},"analyse":"string","produits":[{"categorie":"string","nom":"string","marque":"string","raison":"string","prix":"string","score":0}],"routine":{"matin":["string","string","string"],"soir":["string","string","string"]},"conseil":"string"}\n6 produits variés. JSON uniquement.`;

    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
              contents: [{parts: [{inline_data:{mime_type:"image/jpeg",data:image}},{text:prompt}]}],
              generationConfig: {temperature:0.7,maxOutputTokens:3000}
            })
          }
        );

        const data = await res.json();

        if (data.error) {
          const msg = data.error.message || "";
          if (msg.includes("high demand") || msg.includes("overloaded") || res.status === 503) {
            lastError = msg;
            if (attempt < 3) await sleep(2000 * attempt);
            continue;
          }
          throw new Error(msg);
        }

        const result = data.candidates[0].content.parts[0].text;
        return {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},
          body: JSON.stringify({ result })
        };

      } catch(e) {
        lastError = e.message;
        if (attempt < 3) await sleep(2000 * attempt);
      }
    }

    throw new Error(lastError || "Erreur après 3 tentatives");

  } catch(e) {
    return {
      statusCode: 500,
      headers: {"Access-Control-Allow-Origin":"*"},
      body: JSON.stringify({ error: e.message })
    };
  }
};
