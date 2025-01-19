import { collections } from "$lib/server/database";
import { ObjectId } from "mongodb";
import { error as svelteError } from "@sveltejs/kit";
import { authCondition } from "$lib/server/auth";
import { UrlDependency } from "$lib/types/UrlDependency";
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	let conversation;
	let shared = false;
	const { id } = params;

	try {
		// Determine the type of conversation (shared or personal)
		if (id.length === 7) {
			// Shared link of length 7
			conversation = await collections.sharedConversations.findOne({
				_id: id,
			});
			shared = true;

			if (!conversation) {
				throw svelteError(404, "Conversation not found");
			}
		} else {
			// Validate ObjectId length and format
			if (!ObjectId.isValid(id)) {
				throw svelteError(400, "Invalid conversation ID format");
			}

			// Personal conversation
			conversation = await collections.conversations.findOne({
				_id: new ObjectId(id),
				...authCondition(locals),
			});

			if (!conversation) {
				const conversationExists =
					(await collections.conversations.countDocuments({
						_id: new ObjectId(id),
					})) !== 0;

				if (conversationExists) {
					throw svelteError(
						403,
						"You don't have access to this conversation. If someone gave you this link, ask them to use the 'share' feature instead."
					);
				}

				throw svelteError(404, "Conversation not found.");
			}
		}

		// Return the conversation data
		const responseBody = {
			messages: conversation.messages,
			title: conversation.title,
			model: conversation.model,
			preprompt: conversation.preprompt,
			assistant: conversation.assistantId
				? JSON.parse(
					JSON.stringify(
						await collections.assistants.findOne({
							_id: new ObjectId(conversation.assistantId),
						})
					)
				)
				: null,
			shared,
		};

		return new Response(JSON.stringify(responseBody), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});

	} catch (e) {
		return new Response(JSON.stringify({ message: e.message }), {
			status: e.status || 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};