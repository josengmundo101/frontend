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

// Initialize Conversation Array
let conversation = [];

// Btn Submit
const btn_submit = document.getElementById("btn_submit");
if (btn_submit) {
  btn_submit.onclick = async function (e) {
    // Get Text from Message
    const txt_message = document.getElementById('txt_message');
    let message = txt_message.value;
    txt_message.value = '';
    
    // ...

    // Make the API request to OpenAI
    const formData = new FormData();
    formData.append('message', message);
    const result = await window.axios.openAI(formData.get("message"));

    // Check Error if it exists
    if (result.error) {
      alertMessage("error", result.error.message);
      return;
    }

    // Set AI Response
    let response = result.choices[0].text.trim();

    // Update the message response element
    document.getElementById("message_response").innerHTML = JSON.stringify(response).replace(/\\n/g, '');

    // ...

  //console.log(db_response);
  
    console.log(store_response);
    // Reload Chatbox
    setChatbox();
    // Enable Submit Button
    btn_submit.innerHTML = '<img src="./images/ic_plane.png" width="30" height="30" alt="">';
    btn_submit.disabled = false;
  };
}

function store_response() {
  // Get the user input
  var userMessage = document.getElementById("txt_message").value;

  // Clear the input field
  document.getElementById("txt_message").value = "";

  // Create a new message element
  var messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add("message-user");
  messageElement.innerHTML = '<img class="img-you" src="./images/img_you.png" alt=""><p>' + userMessage + '</p>';

  // Append the message element to the conversation
  document.getElementById("div-conversation").appendChild(messageElement);

  // Scroll to the bottom of the conversation
  var conversationElement = document.getElementById("div-conversation");
  conversationElement.scrollTop = conversationElement.scrollHeight;

  // Call the function to send the user message to the backend and receive a response
  send_message(userMessage);
}


// Load Chatbox
setChatbox();
// Callback Func for Chatbox

async function setChatbox() {
  // Retrieve Data from Backend API's Database
  const response = await window.axios.backend('get', 'prompts');

  // Create an HTML string to hold the conversation
  let htmlResult = '';

  // Iterate over each message in the response
  response.forEach((message) => {
    // Determine if the message was sent by the user or the AI
    const messageType = message.sender === 'user' ? 'message-user' : 'message-ai';

    // Create the message element
    const messageElement = `<div class="message ${messageType}">
                              <img class="img-${messageType}" src="./images/img_${messageType}.png" alt="">
                              <p>${message.content}</p>
                            </div>`;

    // Append the message element to the HTML result
    htmlResult += messageElement;
  });

// Display Result in Div
const div_conversation = document.getElementById('div-conversation');
div_conversation.innerHTML = htmlResult;
div_conversation.scrollTo(0, div_conversation.scrollHeight);
}
    // Set Time or Date based on Created At
    let date = created_at.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    let time = created_at.toLocaleTimeString('en-US', { timeZone: 'Asia/Manila' });
    htmlResult += '<div class="d-flex flex-row justify-content-end">' +
                  '<div>' +
                    '<p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' + response[count].message + '</p>' +
                    '<p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">' + ( isToday ? time : date ) + '</p>' +
                  '</div>' +
                  '<img class="img-junjun" src="./images/img_you.png" alt="">' +
                '</div>' +
                '<div class="d-flex flex-row justify-content-start mb-4 pt-1">' +
                  '<img class="img-you" src="./images/img_junjun.png" alt="">' +
                  '<div>' +
                    '<p class="small p-2 ms-3 mb-1 rounded-3 theme-bg-surface">' + response[count].response + '</p>' +
                    '<p class="small ms-3 mb-3 rounded-3 text-muted">' + ( isToday ? time : date ) + '</p>' +
                  '</div>' +
                '</div>';

// Alert Message
function alertMessage(status, sentence){
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
  });
}