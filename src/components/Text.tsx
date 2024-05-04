import React from 'react'


type Props = {
    id: string,
    text: string,
    count? :string,
    value: number
}

const Text = (props: Props):JSX.Element => {
    const {id, text, count, value} = props;
    const innerHTML = count ? `${text}[${count}]` : text;
    return (
        <div 
            id={id} 
            className='bold'
        >{`${innerHTML}:${value}`}</div>
    );
}

export default Text
