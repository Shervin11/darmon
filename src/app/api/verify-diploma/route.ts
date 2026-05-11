import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert File to base64
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type;

    const systemPrompt = `You are a medical diploma verification expert. Determine if the uploaded image is an official diploma, degree, or certificate for a healthcare professional (doctor, pharmacist, nurse, dentist, etc.).

IMPORTANT RULES:
1. The diploma can be in ANY language (e.g., Russian, Tajik, English). Bilingual diplomas (e.g., Tajik/Russian) are extremely common and MUST BE ACCEPTED.
2. It will likely contain HANDWRITTEN text. This is normal and authentic.
3. Accept any medical/healthcare field (e.g., "Фармация" / Pharmacy, "Лечебное дело", "Педиатрия", etc.).
4. Do NOT reject just because it looks old, has handwritten parts, or is in multiple languages. If you see words like "ДИПЛОМ", "DIPLOMA", and it relates to a medical/pharmacy university, ACCEPT it.

Respond strictly with valid JSON without any markdown formatting:
{
  "is_valid": true,
  "confidence_score": 0.9,
  "reason": "short explanation"
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: systemPrompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq Vision API error:", errorData);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "{}";

    console.log("=== RAW AI RESPONSE ===");
    console.log(assistantMessage);
    console.log("=======================");

    // Parse the AI response robustly
    let aiVerdict;
    try {
      // Strip markdown code blocks just in case
      const cleanJson = assistantMessage.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      aiVerdict = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", assistantMessage);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Extremely robust validation check
    const validStr = String(aiVerdict.is_valid).toLowerCase().trim();
    const isVerdictTrue = validStr === "true" || validStr === "yes" || validStr === "1";
    
    const confidence = Number(aiVerdict.confidence_score);
    const isConfident = isNaN(confidence) ? true : confidence >= 0.2; // Accept even low confidence (20%+) due to handwriting

    const isValid = isVerdictTrue && isConfident;

    console.log("=== VERDICT DEBUG ===");
    console.log("aiVerdict:", JSON.stringify(aiVerdict));
    console.log("validStr:", validStr, "isVerdictTrue:", isVerdictTrue);
    console.log("confidence:", confidence, "isConfident:", isConfident);
    console.log("FINAL isValid:", isValid);
    console.log("=====================");

    if (!isValid) {
      return NextResponse.json({
        isValid: false,
        message: aiVerdict.reason || "Документ отклонен: это не медицинский диплом.",
        data: aiVerdict,
      }, { status: 400 });
    }

    return NextResponse.json({
      isValid: true,
      message: "Диплом успешно верифицирован.",
      data: aiVerdict,
    });

  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
