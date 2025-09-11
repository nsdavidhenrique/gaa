export const brDateTime = (isoString) => {
    let brDate = Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        timeStyle: 'short',
        dateStyle: 'short'
    }).format(new Date(isoString))
    return brDate
}
