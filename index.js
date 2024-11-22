import express from 'express';
import cors from 'cors';
import { DatabaseFormulario} from './src/app/db/database-formulario.js'
import { DatabaseQuestao} from './src/app/db/database-questao.js'

const app = express();

app.use(cors());
app.use(express.json()); 


const database = new DatabaseFormulario();
const databaseQ = new DatabaseQuestao();

app.get('/formularios', async (request, response) =>{
    const formularios = await database.getFormularios();
    return response.json(formularios);
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
        const resultado = await database.criarFormulario(formulario, questaoId);
        return response.json(resultado);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao criar formulário.' });
    }
});

app.put('/formularios/editar/:id', async (request, response) =>{
    const formulario = request.body;
    const formularioId = request.params.id;
    const resultado = await database.alterarFormulario(formularioId, formulario);
    return response.json(resultado);
});

app.delete('/formularios/excluir/id', async (request, response) => {
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