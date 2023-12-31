import './Home.css';
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [interactions, setInteractions] = useState([{output: 'Hi, How may i help you?'}]);
    const [input, setInput] = useState('');

    const handleInput = async () => {
        if( input === ''){
            alert('Type something to ask');
        }else{
            try{
                const output = await axios.get(`http://localhost:8080/api/response/${input}`);
                setInteractions([
                    ...interactions,
                    {input: input, output: output.data}
                ]);
            }catch(error){
                console.log(error);
            };
        }
        setInput('');
    }

    const handleKeyDown = (key) =>{
        if(key === 'Enter'){
            handleInput();
        }
    }

    const handleChange = (value) => {
        setInput(value);
    }

    return (
        <div className="container">
            {interactions.length !== 0 && interactions.map((dialogue, index) => (
                <div key={index}>
                    {dialogue.input && 
                    <div className='userSaid'>
                        You: {dialogue.input}
                    </div>}
                    <div className='botSaid'>
                        Audio: {dialogue.output}
                    </div>
                </div>
            ))}
            <div className="inputContainer">
                <input 
                    className="inputField"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    placeholder="Type your message"
                />
                <button className="sendButton" onClick={handleInput} >Send</button>
            </div>
        </div>
    );
}
