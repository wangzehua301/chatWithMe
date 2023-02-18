import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chat_container = document.querySelector('#chat_container');


let loadInterval

//处理答案缓慢加载
function typeText(botBlock, text) {
  let i = 0
  const interval = setInterval(() => {
    botBlock.innerHTML += text[i]
    i++
    if(i === text.length) clearInterval(interval)
  }, 100)
}

//处理加载中...
function loading(botBlock) {
  botBlock.innerHTML = '.'
  loadInterval = setInterval(() => {
    botBlock.innerHTML += '.'
    if(botBlock.innerHTML.length > 3) botBlock.innerHTML = '.'
  }, 300)
}



//生成唯一id
function generateUuid() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

const generateChatBlock = (isAi, message, uuid) => {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img 
                  src=${isAi ? bot : user} 
                  alt="${isAi ? 'bot' : 'user'}" 
                />
            </div>  
            <div class="message" id=${uuid}>${message}</div>
        </div>
    </div>
  `
  )
}

//表单提交事件
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form)

  //user chat block
  chat_container.innerHTML += generateChatBlock(false, data.get('prompt'))

  // to clear the textarea input 
  form.reset()



  //bot chat block
  const uuid = generateUuid()
  chat_container.innerHTML += generateChatBlock(true, " ", uuid)

  // scroll to the bottom of the chat container
  chat_container.scrollTop = chat_container.scrollHeight

  //get the bot block
  const botBlock = document.getElementById(uuid)

  //load animation
  loading(botBlock)

  //fetch the bot response
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  //clear the load animation
  clearInterval(loadInterval)
  botBlock.innerHTML = ' '

  if(response.ok) {
    const { bot } = await response.json()
    // botBlock.innerHTML = bot.trim()
    typeText(botBlock, bot.trim())

  } else {
    botBlock.innerHTML = "Sorry, I'm not feeling well today. Please try again later."
  }

}

// 监听提交事件&enter事件
form.addEventListener('submit', (e) => {
  handleSubmit(e)
})  
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})