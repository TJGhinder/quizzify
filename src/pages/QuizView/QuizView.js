import React, {useState, useEffect} from 'react'
import Question from './components/Question'
import axios from 'axios';

import './index.css'

export default function QuizView() {

    const targetURL = 'https://docs.google.com/spreadsheets/d/e/' + window.location.href.split('?id=')[1]

    
    // Get data on load
    const [loadedData,setLoadedData] = useState('Loading')
    useEffect(() => {
        async function fetchMyAPI() {
            console.log('inside async')
            var response = await fetch(targetURL);
            var body = await response.text(); // .json() is asynchronous and therefore must be awaited
            var tableBody = body.split('<table')[1]
            let splitBody = tableBody.split('<td')
            
            let dataArray = []

            // Take split body, and split by closing of the td.
            for (let i=0;i<splitBody.length;i++){
                dataArray.push(splitBody[i].split('>')[1])
            }

            let cleanedDataArray = []

            // Take the remainders, and those are going to be the contents of the cells!
            for (let i=0;i<dataArray.length;i++){
                if (dataArray[i].split('</td')[0].length>0){
                    cleanedDataArray.push(dataArray[i].split('</td')[0])
                }
                
            }

            setLoadedData(cleanedDataArray) 
        }  

        console.log('calling fetch')
      
        fetchMyAPI();
      }, []);


    const [questions,setQuestions] = useState([])
    const [title,setTitle] = useState('Loading...')
    const [subject,setSubject] = useState('Loading...')
    const [author,setAuthor] = useState('Loading...')
    const dataToQuestionFormat = (data) => {

        let questionData = []

        for (let i=0;i<data.length;i++){
            if (data[i]=="Quiz Title (Optional):") {
                if (data[i + 1]=="---") {
                    setTitle('')
                } else {
                    setTitle(data[i + 1])
                }
            }

            else if (data[i]=="Quiz Subject (Optional):") {
                if (data[i + 1]=="---") {
                    setSubject('')
                } else {
                    setSubject(data[i + 1])
                }
            } 

            else if (data[i]=="Your Name (Optional):") {
                if (data[i + 1]=="---") {
                    setAuthor('')
                } else {
                    setAuthor(data[i + 1])
                }
            } 

            else if (data[i].indexOf('ID_') >= 0) {

                // If there is more data, we should first check to make sure
                // it isn't an empty question. Otheriwse add it!
                if (data[i+1]!=undefined) {
                    if (data[i+1].indexOf('ID_') == -1) {
                        console.log('QUESTION DATA')
                        // That means we have question data! Let's get it:
                        
                        let questionNum = data[i].split('ID_')[1]
                        let questionText = data[i+1]
                        let questionType = data[i+2]
                        let correctAnswer = data[i+3]
                        let answerOptions = []

                        if (questionType == 'Multiple Choice') {
                            let correctAnswer = data[i+3]
                            for (let j=4;j<20;j++){
                                if (data[i+j]!=undefined && data[i+j].indexOf('ID_') == -1){
                                    answerOptions.push(data[i+j])
                                }
    
                                if (data[i+j].indexOf('ID_') != -1) break;
                            }
                            
                        }

                        if (questionType == 'Matching') {
                            let correctAnswer = '---'
                            for (let j=3;j<20;j++){
                                if (data[i+j]!=undefined && data[i+j].indexOf('ID_') == -1){
                                    answerOptions.push(data[i+j])
                                }
    
                                if (data[i+j].indexOf('ID_') != -1) break;
                            }
    
                            console.log(answerOptions)
                        }


                        

                        questionData.push(<Question
                            num={questionNum}
                            text={questionText}
                            type={questionType}
                            correctAnswer={correctAnswer}
                            answerOptions={answerOptions}
                            />)
                       
                        console.log(data[i+3])

                        

                    }

                }


            }
        
        }

        setQuestions(questionData)


    }

    
        
    useEffect(() => {
        console.log('inside loaded data.')
        console.log(loadedData)
        dataToQuestionFormat(loadedData)
    }, [loadedData])
        

    return (
        <div className='quiz-container'>
            {title!='' && <h1>{title}</h1>}
            {subject!='' && <h2>{subject}</h2>}
            {author!='' && <h3>{author}</h3>}
            {questions.map(question => question)}
            <button className='submit-button'>Submit Quiz</button>
        </div>
    )
}
