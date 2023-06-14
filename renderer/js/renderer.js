// Initialize Conversation Array
let conversation = [];

// Load Conversation from Local Storage
const storedConversation = localStorage.getItem('conversation');
if (storedConversation) {
  conversation = JSON.parse(storedConversation);
  setChatbox();
}

// Btn Continue
const btn_continue = document.getElementById("btn_continue");
if (btn_continue) {
  btn_continue.onclick = function (e) {
    // Hide Intro Area and Show ChatBox
    const intro_area = document.getElementById("intro-area");
    const chat_area = document.getElementById("chat-area");
    intro_area.classList.add('d-none');
    chat_area.classList.remove('d-none');
    chat_area.classList.add('d-flex');
    // Show Latest Chat
    const div_conversation = document.getElementById('div-conversation');
    div_conversation.scrollTo(0, div_conversation.scrollHeight);
    // Focus Input Type Message
    const txt_message = document.getElementById('txt_message');
    txt_message.focus();
  }
}

// Btn Submit
const btn_submit = document.getElementById("btn_submit");
if (btn_submit) {
  btn_submit.onclick = async function (e) {
    // Get Text from Message
    const txt_message = document.getElementById('txt_message');
    const userMessage = txt_message.value.trim();
    txt_message.value = '';

    if (userMessage === '') {
      return;
    }

    // Store user's message in the conversation array
    conversation.push({ content: userMessage, sender: 'user' });

    // Make the API request to OpenAI
    const formData = new FormData();
    formData.append('message', userMessage);
    const result = await window.axios.openAI(formData.get('message'));

    // Check Error if it exists
    if (result.error) {
      alertMessage('error', result.error.message);
      return;
    }

    // Set chatbot's response
    const response = result.choices[0].text.trim();

    // Store chatbot's response in the conversation array
    conversation.push({ content: response, sender: 'chatbot' });

    // Store the conversation in local storage
    localStorage.setItem('conversation', JSON.stringify(conversation));

    // Store the conversation in the database
    const storeResponse = await window.axios.supaBase('post', 'prompts', {
      user_message: userMessage,
      bot_response: response
    });
    
    // Reload Chatbox
    setChatbox();

    // Enable Submit Button
    btn_submit.innerHTML = '<img src="./images/paperplane.png" width="30" height="30" alt="">';
    btn_submit.disabled = false;
  };
}

// Set the conversation in the chat area
function setChatbox() {
  // Get the chat area element
  const chatArea = document.getElementById('div-conversation');
  
  // Clear the chat area
  chatArea.innerHTML = '';

  // Loop through the conversation array and append messages to the chat area
  conversation.forEach(message => {
    const { content, sender } = message;
    const messageType = sender === 'user' ? 'user' : 'chatbot';
    const messageElement = `<div class="d-flex flex-row justify-content-${sender === 'user' ? 'end' : 'start'} mb-4 pt-1">
                              <img class="img-${messageType}" src="./images/img_${messageType}.png" alt="">
                              <div>
                                <p class="small p-2 ms-3 mb-1 rounded-3 theme-bg-surface">${content}</p>
                                <p class="small ms-3 mb-3 rounded-3 text-muted">${getCurrentTime()}</p>
                              </div>
                            </div>`;
    chatArea.innerHTML += messageElement;
  });

  // Scroll to the bottom of the chat area
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Get current time in HH:mm AM/PM format
function getCurrentTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Alert Message
function alertMessage(status, message) {
  window.Toastify.showToast({
    text: message,
    duration: 3000,
    stopOnFocus: true,
  });
}
