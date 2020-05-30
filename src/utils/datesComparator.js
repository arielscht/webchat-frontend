const dateComparator = (recentDate, pastDate) => {
    const pastDay = pastDate.getDate();
    const pastMonth = pastDate.getMonth();
    const pastYear = pastDate.getFullYear();
    let pastDateFormated;
    if((pastMonth + 1).toString().length === 1) {
        pastDateFormated =  pastDay + "/" + "0" + (pastMonth + 1) + "/" + pastYear;
    } else {
        pastDateFormated =  pastDay + "/" + (pastMonth + 1) + "/" + pastYear;
    }

    const recentDay = recentDate.getDate();
    const recentMonth = recentDate.getMonth();
    const recentYear = recentDate.getFullYear();


    const differenceInDays = Math.ceil(
        Math.abs(
            new Date(recentYear, recentMonth, recentDay) - new Date(pastYear, pastMonth, pastDay)
        ) 
        / (1000 * 60 * 60 * 24)
    );

    if(differenceInDays === 0) {
        return 'Hoje';
    } else if(differenceInDays === 1) {
        return 'Ontem';
    } else if(differenceInDays < 6) {
        const dayOfWeek = pastDate.getDay();
        switch(dayOfWeek) {
            case 0:
                return 'Domingo';
            case 1:
                return 'Segunda-Feira';
            case 2:
                return 'Terça-Feira';
            case 3:
                return 'Quarta-feira';
            case 4:
                return 'Quinta-Feira';
            case 5:
                return 'Sexta-Feira';
            case 6:
                return 'Sábado';
        }
    } else {
            return pastDateFormated;
    }

};

export default dateComparator;