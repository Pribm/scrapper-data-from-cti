"use client"

import React, { HTMLAttributes, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'

const Page = () => {

  const [selectorInput, setSelectorInput] = useState('')
  const [textAreaSnippet, setTextAreaSnippet] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [answers, setAnswers] = useState('')

  const extractedTextData : RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if(extractedText !== ''){
      getAnswerFromAi()
    }
  }, [extractedText])

  const extractSnippet = (e: React.FormEvent) => {
    e.preventDefault()
    setExtractedText('')
    const data = new DOMParser().parseFromString(textAreaSnippet, 'text/html')
    const listOfElements = data.getElementsByClassName(selectorInput)
    for (const el of listOfElements) {
      setExtractedText(extractedText => extractedText + el.innerHTML)
    }

    getAnswerFromAi()
  }

  const getAnswerFromAi = async () => {
    setAnswers('Loading Answers...')
    const prompt = {
      prompt: extractedTextData.current?.innerText.replace(/\n\s+/g, "\n")
    }
    const answer = await fetch('http://localhost:3000/api/generate-answers', {
      method: 'POST',
      body: JSON.stringify(prompt),
      headers: {
        "Content-Type" : "application/json"
      }
    })

    const data = await answer.json()
    setAnswers(data.text)
  }

  const getSession = async () => {
    const data = {
      username: 'fulano',
      password: '123456'
    }
    const resPromise = await fetch("https://my.cti.qld.edu.au/login/index.php", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type' : 'application/json',
        'Access-Control-Request-Method': 'POST',
        "Origin": "http://127.0.0.1:3000"
      }
    })

    const resData = await resPromise.json()
    console.log(resData)
  }

  return (
    <div className='min-h-screen'>
      <div className="container md:mx-auto p-8 flex flex-col">
        <div className='mx-auto flex flex-col min-w-[30rem] mb-8'>
          <input type="text" placeholder='login canterbury' className='w-full p-4 mt-2'/>
          <input type="password" placeholder='senha canterbury' className='w-full p-4 mt-2'/>
          <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2'
          onClick={getSession}
          >
            Login
          </button>
        </div>
      <form className='grid md:grid-cols-2 gap-8'>
        <div className='col'>
          <h2>Filters</h2>
          <div>
            <label htmlFor="type-of-selector">Type of selector</label>
            <select name="" id="" >
              <option value="">ClassName</option>
              <option value="">Id</option>
              <option value="">Regex</option>
            </select>
          </div>
          <input type="text" placeholder='selector' className='w-full p-4 mt-2' onChange={e => setSelectorInput(e.target.value)} />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2'
            onClick={extractSnippet}
          >
            Send Text
          </button>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="code-area">Put Your HTML snippet here</label>
          <textarea
            rows={5}
            aria-multiline
            className='p-2'
            id="code-area"
            value={textAreaSnippet}
            onChange={e => setTextAreaSnippet(e.target.value)}
          />
        </div>
      </form>
      <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4>Text From Html</h4>
            <p
              ref={extractedTextData}
              dangerouslySetInnerHTML={{
                __html: extractedText
              }}
            />
          </div>
          <div>
            <h4>Answers</h4>
            <p className='whitespace-pre-wrap' >
              {answers}
            </p>
          </div>
      </div>
      </div>
    </div>
  )
}

export default Page