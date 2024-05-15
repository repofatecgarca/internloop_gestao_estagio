function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length > 3) {
        cpf = cpf.slice(0, 3) + '.' + cpf.slice(3);
    } if (cpf.length > 7) {
        cpf = cpf.slice(0, 7) + '.' + cpf.slice(7);
    } if (cpf.length > 11) {
        cpf = cpf.slice(0, 11) + '-' + cpf.slice(11, 13);
    }
    return cpf;
}

function onCPFInput(event) {
    event.target.value = formatCPF(event.target.value);
}

function applyPhoneMask(phone) {
    // Remove todos os caracteres não numéricos
    let digits = phone.replace(/\D/g, '');

    if (digits.length > 11) {
        digits = digits.substring(0, 11);
    }

    let formattedPhone;

    if (digits.length <= 2) {
        formattedPhone = digits;
    } else if (digits.length <= 7) {
        formattedPhone = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else {
        formattedPhone = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    }

    return formattedPhone;
}

function onInputHandler(input) {
    input.value = applyPhoneMask(input.value);
}