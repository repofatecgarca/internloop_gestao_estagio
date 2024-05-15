function excluirItem(id) {
    fetch(`http://localhost:3333/administrador/excluir/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            response.headers.get('/administrador')
        } else {
            console.error('Erro ao excluir item:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Erro ao excluir item:', error);
    });
}