document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('esports-profile-form');
    const competitiveRadios = document.querySelectorAll('input[name="play_competitively"]');
    const competitiveDetailsDiv = document.getElementById('competitive-details');
    const confirmationMessage = document.getElementById('confirmation-message');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const furiaData = {
        jogadores: "O time atual de CS da FURIA (em meados de 2024) inclui: FalleN, KSCERATO, yuurih, chelo, arT. Lembre-se que escalações podem mudar, sempre confira fontes oficiais como o site da FURIA ou HLTV.org!",
        historia: "A FURIA Esports foi fundada em 2017 por Jaime Pádua, André Akkari e Cris Guedes. Rapidamente se destacou no cenário brasileiro de CS e ganhou projeção internacional, tornando-se uma das organizações mais populares e bem-sucedidas do Brasil.",
        jogos: "Para ver a agenda de jogos da FURIA, resultados recentes e estatísticas detalhadas, recomendo que você visite o site HLTV.org, que é a principal referência para o cenário competitivo de CS:GO/CS2.",
        momentos: "A FURIA é famosa por seu estilo de jogo 'agressivo controlado' e momentos marcantes! Muitas jogadas do 'arT breakthrough', clutches do KSCERATO e snipadas do FalleN ficaram na história. Você pode encontrar compilações incríveis no YouTube procurando por 'FURIA CS highlights'.",
        titulos: "A FURIA conquistou diversos títulos importantes, tanto na América do Norte quanto em campeonatos globais. Alguns destaques incluem a ESL Pro League Season 12 NA, IEM New York 2020 NA, Arctic Invitational 2019, e múltiplos títulos brasileiros. Eles também tiveram boas campanhas em Majors.",
        sair: "Obrigado por usar o chat da FURIA! Continue torcendo pela pantera! #DIADEFURIA",
        default: "Desculpe, não entendi. Você pode me perguntar sobre: jogadores, história, jogos, melhores momentos ou títulos. Se quiser encerrar, digite 'sair' ou 'obrigado'."
    };

    // --- Show/Hide Competitive Details Section ---
    function toggleCompetitiveDetails() {
        const selectedValue = document.querySelector('input[name="play_competitively"]:checked').value;
        if (selectedValue === 'yes') {
            competitiveDetailsDiv.style.display = 'block';
        } else {
            competitiveDetailsDiv.style.display = 'none';
            // Clear the input if hiding
            document.getElementById('competitive_games').value = '';
        }
    }

    competitiveRadios.forEach(radio => {
        radio.addEventListener('change', toggleCompetitiveDetails);
    });

    // Initial check in case 'yes' is pre-selected (it's not, but good practice)
    toggleCompetitiveDetails();

    // --- Form Submission Handling ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default browser form submission

        // Hide previous confirmation
        confirmationMessage.style.display = 'none';

        const formData = new FormData(form);
        const profileData = {};

        // Extract data from FormData
        formData.forEach((value, key) => {
            // Handle checkboxes (multiple values for the same key)
            if (key.endsWith('[]')) { // Convention often used, though not strictly necessary here
                const actualKey = key.slice(0, -2);
                if (!profileData[actualKey]) {
                    profileData[actualKey] = [];
                }
                profileData[actualKey].push(value);
            } else if (form.elements[key]?.type === 'checkbox') {
                 // Handle checkboxes specifically by checking their 'checked' status
                 // We'll group them manually below
                 return; // Skip individual checkbox entries here
            } else if(form.elements[key]?.type === 'radio') {
                // Handle radio buttons by checking the 'checked' one
                const checkedRadio = form.querySelector(`input[name="${key}"]:checked`);
                if(checkedRadio) {
                    profileData[key] = checkedRadio.value;
                }
            }
             else {
                profileData[key] = value;
            }
        });

        // Manually collect checked checkboxes
        profileData.fav_game = Array.from(form.querySelectorAll('input[name="fav_game"]:checked')).map(cb => cb.value);
        profileData.platform = Array.from(form.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);

        // Clean up empty fields or defaults that weren't changed
        if (profileData.follow_duration === "") delete profileData.follow_duration;
        if (profileData.watch_frequency === "") delete profileData.watch_frequency;
        if (profileData.play_competitively === 'no') delete profileData.competitive_games; // Remove if not playing competitively

        // Log the collected data to the console
        console.log("Esports Fan Profile Data:", profileData);

        // Show confirmation message
        confirmationMessage.style.display = 'block';

        // Optional: Scroll to the confirmation message
        confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Optional: Reset the form after submission
        // form.reset();
        // toggleCompetitiveDetails(); // Re-hide competitive details if form is reset
    });

    // Function to add messages to the chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to process user input
    function processUserInput() {
        const inputText = userInput.value.trim().toLowerCase();
        if (inputText === "") return;

        addMessage(userInput.value, 'user'); // Display original casing
        userInput.value = ''; // Clear input field

        let botResponse = furiaData.default; // Default response

        if (inputText.includes('jogadores') || inputText.includes('time') || inputText.includes('escalação') || inputText.includes('roster')) {
            botResponse = furiaData.jogadores;
        } else if (inputText.includes('história') || inputText.includes('historia') || inputText.includes('fundação') || inputText.includes('começou')) {
            botResponse = furiaData.historia;
        } else if (inputText.includes('jogos') || inputText.includes('partidas') || inputText.includes('calendário') || inputText.includes('agenda')) {
            botResponse = furiaData.jogos;
        } else if (inputText.includes('momentos') || inputText.includes('highlights') || inputText.includes('jogadas')) {
            botResponse = furiaData.momentos;
        } else if (inputText.includes('títulos') || inputText.includes('titulos') || inputText.includes('campeonatos') || inputText.includes('ganhou')) {
            botResponse = furiaData.titulos;
        } else if (inputText.includes('sair') || inputText.includes('obrigado') || inputText.includes('tchau') || inputText.includes('encerrar')) {
            botResponse = furiaData.sair;
            // Optionally disable input after farewell
            // userInput.disabled = true;
            // sendButton.disabled = true;
        }

        // Simulate bot thinking time
        setTimeout(() => {
            addMessage(botResponse, 'bot');
        }, 500);
    }

    // Event listeners for send button and enter key
    sendButton.addEventListener('click', processUserInput);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            processUserInput();
        }
    });

    // Initial welcome message
    window.addEventListener('load', () => {
        setTimeout(() => {
            addMessage("Bem-vindo ao Chat da FURIA! Como posso te ajudar a saber mais sobre nosso time de CS?", 'bot');
        }, 500); // Delay slightly for effect
    });
});