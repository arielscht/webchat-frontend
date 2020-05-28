import React from 'react';

import classes from './styles.module.css'

const Popover = ({children, opened}) => {
    const cssClasses = [classes.Container];
    if(!opened) {
        cssClasses.push(classes.Closed);
    }
    return (
        <>
        <div className={cssClasses.join(' ')}>
            {children}
        </div>
        </>
    );
}

export default Popover;