import express from 'express';
import cors from 'cors';
import { DatabaseFormulario} from './src/app/db/database-formulario.js'
import { DatabaseQuestao} from './src/app/db/database-questao.js'
import { DatabaseFormularioResposta } from './src/app/db/database-formularioResposta.js';
import { DatabaseQuestaoResposta } from './src/app/db/database-questaoResposta.js';

const app = express();

app.use(cors());
app.use(express.json()); 


const database = new DatabaseFormulario();
const databaseQ = new DatabaseQuestao();
const databaseFormResp = new DatabaseFormularioResposta();
const databaseQuestResp = new DatabaseQuestaoResposta();

app.get('/formularios', async (request, response) =>{
    const formularios = await database.getFormularios();
    return response.json(formularios);
});

app.get('/formularios/:id', async (request, response) =>{
    const id = request.params.id;
    const formulario = await database.getFormulario(id);
    return response.json(formulario);
});


app.post('/formularios/criar', async (request, response) => {
    const formulario = request.body;
    if (!formulario.nome || !formulario.descricao || !formulario.questao) {
        return response.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }
    if (!Array.isArray(formulario.questao) || formulario.questao.length === 0) {
        return response.status(400).json({ error: 'Pelo menos uma questão é obrigatória.' });
    }
    const questao = formulario.questao[0];

    if (!questao.titulo || !questao.tipo || !questao.descricao || !questao.opcoes) {
        return response.status(400).json({ error: 'Campos obrigatórios da questão estão faltando.' });
    }    

    try {
        const questaoId = await databaseQ.criarQuestao(questao);
        for(let i = 0; i < questao.opcoes.length; i++){
            const opcao = questao.opcoes[i];
            await databaseQ.criarOpcao(opcao, questaoId);
        }
        const resultado = await database.criarFormulario(formulario, questaoId);
        return response.json(resultado);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao criar formulário.' });
    }
});

app.post('/formularios/responder/:id', async (request, response) =>{
    const formularioid = request.params.id;
    const resposta = request.body;
    let pontuacao = 0;
    const questoes = resposta.questoesResposta;
    for(let i = 0; i < questoes.length; i++){
        const questao = questoes[i];
        await databaseQuestResp.responderQuestao(questao, formularioid);
        pontuacao+= questao.pontuacao;
    }

    const resultado = await databaseFormResp.responderFormulario(formularioid, pontuacao);
    return response.json(resultado);
})

app.put('/formularios/editar/:id', async (request, response) =>{
    const formulario = request.body;
    const formularioId = request.params.id;
    const resultado = await database.alterarFormulario(formularioId, formulario);
    return response.json(resultado);
});

app.delete('/formularios/excluir/:id', async (request, response) => {
    const formularioId = request.params.id;
    const resultado = await database.deletarFormulario(formularioId);
    return response.json(resultado);
})

app.get('/questoes', async (request, response) =>{
    const questoes = await databaseQ.getQuestoes();
    return response.json(questoes);
})


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})