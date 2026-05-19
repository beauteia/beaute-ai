exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type"},
      body: ""
    };
  }

  try {
    const { image } = JSON.parse(event.body);
    const key = process.env.OPENAI_KEY;

    const prompt = `Tu es experte en dermatologie esthétique. Analyse ce visage et retourne UNIQUEMENT un JSON valide sans markdown:\n{"profil":{"typePeau":"string","teint":"string","carnation":"string","particularites":["string","string"]},"analyse":"string","produits":[{"categorie":"string","nom":"string","marque":"string","raison":"string","prix":"string","score":0}],"routine":{"matin":["string","string","string"],"soir":["string","string","string"]},"conseil":"string"}\n6 produits variés. JSON uniquement.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const result = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},
      body: JSON.stringify({ result })
    };

  } catch(e) {
    return {
      statusCode: 500,
      headers: {"Access-Control-Allow-Origin":"*"},
      body: JSON.stringify({ error: e.message })
    };
  }
};
