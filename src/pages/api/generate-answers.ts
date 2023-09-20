import { OPEN_AI_SECRET_KEY } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResponseData = {
    text: string;
}

interface GenerateNextApiRequest extends NextApiRequest {
    body: {
        prompt: string;
    }
}
const cfg = new Configuration({
    apiKey: OPEN_AI_SECRET_KEY
})

const openAi = new OpenAIApi(cfg)

export default async function handler(req: GenerateNextApiRequest, res: NextApiResponse<ResponseData>) {

    const prompt = req.body.prompt

    if (!prompt || prompt === '') {
        return res.status(400).json({ text: 'Please send your prompt' })
    }
    try {

        const aiResult = await openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
            {
                role: "system",
                content: "I will send you a set of questions, please respond they accordingly, respecting the range of amount of words specifications when specified, and separate each question by numbers."
            },
            {
                content: prompt,
                role: "user"
            }],
            temperature: 1,
            max_tokens: 2048,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const response = aiResult.data.choices[0].message?.content || 'Sorry, there was a problem!'
        return res.status(200).json({ text: response })
    } catch (error: any) {
        res.send(error)
    }

}