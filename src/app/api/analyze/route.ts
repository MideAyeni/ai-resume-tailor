import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `You are an expert resume coach and recruiter. Analyze the following resume against the job description and provide:

1. **FIT SCORE** (out of 100): How well does this resume match the job?

2. **MISSING KEYWORDS**: List important keywords/skills from the job description that are missing from the resume.

3. **REWRITTEN BULLETS**: Rewrite the 3 most relevant resume bullets to better match the job description. Make them stronger, more specific, and keyword-optimized.

4. **TOP RECOMMENDATION**: One specific thing the candidate should add or change to significantly improve their chances.

---

JOB DESCRIPTION:
${jobDescription}

---

RESUME:
${resumeText}

Be specific, actionable, and honest.`,
        },
      ],
    });

    const result = completion.choices[0].message.content ?? "";
    return NextResponse.json({ result });

  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}