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
    } else {
            return pastDateFormated;
    }

};

export default dateComparator;