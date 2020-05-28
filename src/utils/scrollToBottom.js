const scrollToBottom = (element) => {
    // const element =  document.getElementById('messagesContainer');
    // console.log(element.scrollHeight);
    element.scrollTop = element.scrollHeight;
};

export default scrollToBottom;