import express from 'express';
import { DatabaseFormulario} from './src/app/db/database-formulario'
import { DatabaseQuestao} from './src/app/db/database-questao'

const app = express();

const database = new DatabaseFormulario();
const databaseQ = new DatabaseQuestao();

app.get('/formularios', async (request, response) =>{
    const formularios = await database.getFormularios();
    return response.json(formularios);
});

app.post('/formularios/criar', async (request, response) =>{
    const formulario = request.body;
    const questao = formulario.questao[0];
    const questaoId = await databaseQ.criarQuestao(questao);
    const resultado = await database.criarFormulario(formulario, questaoId);
    return response.json(resultado);
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


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})