require('dotenv').config();
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { notFound, errorHandler } from './middlewares';
import { MyContext } from './interfaces/MyContext';
import authenticate from './functions/authenticate';
import { generateText } from './api/apiControllers/gptController'

const app = express();

interface Message {
    role: string;
    content: string;
}

(async () => {
    try {
        app.use(
            helmet({
                crossOriginEmbedderPolicy: false,
                contentSecurityPolicy: false,
            })
        );

        // Apply cors middleware globally
        app.use(cors());

        // Moved express.json() middleware here
        app.use(express.json());

        const server = new ApolloServer<MyContext>({
            typeDefs,
            resolvers,
            plugins: [
                process.env.ENVIRONMENT === 'production'
                    ? ApolloServerPluginLandingPageProductionDefault({
                        embed: true as false,
                    })
                    : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
            ],
            includeStacktraceInErrorResponses: false,
        });
        
        await server.start();

        app.use(
            '/graphql',
            // Removed cors<cors.CorsRequest>() from here
            expressMiddleware(server, {
                context: ({ req }) => authenticate(req),
            })
        );

        app.post('/gpt', async (req: Request, res: Response) => {
            const { userMessage } = req.body;
            const conversation: Message[] = [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userMessage },
            ];
            try {
                const generatedText = await generateText(conversation);
                res.json({ text: generatedText });
            } catch (error) {
                res.status(500).json({ error: 'An error occurred' });
            }
        });

        app.use(notFound);
        app.use(errorHandler);
    } catch (error) {
        console.log(error);
    }
})();

export default app;