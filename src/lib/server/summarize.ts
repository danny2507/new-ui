import { LLM_SUMMERIZATION } from "$env/static/private";
import { generateFromDefaultEndpoint } from "$lib/server/generateFromDefaultEndpoint";
import type { Message } from "$lib/types/Message";

export async function summarize(prompt: string) {
	if (!LLM_SUMMERIZATION) {
		return prompt.split(/\s+/g).slice(0, 5).join(" ");
	}

	const messages: Array<Omit<Message, "id">> = [
		{ from: "user", content: "Who is the president of Gabon?" },
		{ from: "assistant", content: "🇬🇦 President of Gabon" },
		{ from: "user", content: "Who is Julien Chaumond?" },
		{ from: "assistant", content: "🧑 Julien Chaumond" },
		{ from: "user", content: "what is 1 + 1?" },
		{ from: "assistant", content: "🔢 Simple math operation" },
		{ from: "user", content: "What are the latest news?" },
		{ from: "assistant", content: "📰 Latest news" },
		{ from: "user", content: "How to make a great cheesecake?" },
		{ from: "assistant", content: "🍰 Cheesecake recipe" },
		{ from: "user", content: "what is your favorite movie? do a short answer." },
		{ from: "assistant", content: "🎥 Favorite movie" },
		{ from: "user", content: "Explain the concept of artificial intelligence in one sentence" },
		{ from: "assistant", content: "🤖 AI definition" },
		{ from: "user", content: prompt },
	];

	return await generateFromDefaultEndpoint({
		messages,
		preprompt: `Bạn là một AI tóm tắt văn bản. Bạn sẽ không bao giờ trả lời trực tiếp câu hỏi của người dùng mà thay vào đó hãy tóm tắt yêu cầu của người dùng thành một câu ngắn gồm bốn từ trở xuống. Luôn bắt đầu câu trả lời của bạn bằng biểu tượng cảm xúc có liên quan đến bản tóm tắt.`,
	})
		.then((summary) => {
			// add an emoji if none is found in the first three characters
			if (!/\p{Emoji}/u.test(summary.slice(0, 3))) {
				return "💬 " + summary;
			}
			return summary;
		})
		.catch((e) => {
			console.error(e);
			return null;
		});
}
