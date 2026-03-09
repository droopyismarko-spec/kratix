import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MAX_MESSAGES = 10;

export async function POST(request) {
  const { messages, quizAnswers, userId } = await request.json();

  // RATE LIMIT CHECK
  if (userId) {
    const today = new Date().toISOString().split("T")[0];

    const { data: limitData } = await supabase
      .from("message_limits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (limitData) {
      // Reset if it's a new day
      if (limitData.reset_date !== today) {
        await supabase
          .from("message_limits")
          .update({ count: 1, reset_date: today })
          .eq("user_id", userId);
      } else if (limitData.count >= MAX_MESSAGES) {
        return Response.json({
          reply: "You've used all 10 of your daily messages. Come back tomorrow — discipline means showing up every day."
        }, { status: 429 });
      } else {
        await supabase
          .from("message_limits")
          .update({ count: limitData.count + 1 })
          .eq("user_id", userId);
      }
    } else {
      // First message ever
      await supabase
        .from("message_limits")
        .insert({ user_id: userId, count: 1, reset_date: today });
    }
  }

  // Build context from quiz answers
  let context = "You are a personal discipline and self-improvement coach inside an app called Kratix. You are direct, motivating, and honest. Keep responses concise and actionable — max 3 paragraphs.";

  if (quizAnswers) {
    context += "\n\nHere is what you know about this user based on their onboarding quiz:\n";
    Object.values(quizAnswers).forEach(a => {
      context += `- ${a.category}: ${a.question} → ${a.answer}\n`;
    });
    context += "\nUse this to give personalized advice. Reference their specific situation when relevant.";
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: context,
    messages: messages,
  });

  return Response.json({
    reply: response.content[0].text
  });
}