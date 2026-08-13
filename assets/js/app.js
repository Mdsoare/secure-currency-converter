/**
 * Mapeamento estrito de moedas e locales suportados
 */
const CURRENCY_LOCALES = Object.freeze({
    'BRL': { locale: 'pt-BR', currency: 'BRL' },
    'USD': { locale: 'en-US', currency: 'USD' },
    'EUR': { locale: 'de-DE', currency: 'EUR' },
    'GBP': { locale: 'en-GB', currency: 'GBP' },
    'BTC': { locale: 'pt-BR', currency: 'BTC' }
});

const ALLOWED_PAIRS = new Set([
    'USD-BRL', 'EUR-BRL', 'GBP-BRL', 'BRL-USD', 'BRL-EUR', 'BTC-BRL'
]);

let currentFetchController = null;

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const pairSelect = document.getElementById('currencyPair');

    amountInput.addEventListener('input', debounce(calculateConversion, 400));
    pairSelect.addEventListener('change', calculateConversion);

    // Carga inicial de dados
    fetchQuickRates();
    calculateConversion();
});

/**
 * Função debounce para limitação de chamadas (Rate Limiting no cliente)
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/**
 * Realiza o cálculo de conversão obtendo dados da API
 */
async function calculateConversion() {
    const amountInput = document.getElementById('amount');
    const pairSelect = document.getElementById('currencyPair');
    const resultBox = document.getElementById('resultBox');
    const errorBox = document.getElementById('errorBox');
    const loader = document.getElementById('loader');

    // Aborta requisições em andamento para evitar Race Conditions
    if (currentFetchController) {
        currentFetchController.abort();
    }

    // Validação e sanitização rigorosa do input
    const rawValue = amountInput.value.replace(',', '.');
    let amount = parseFloat(rawValue);

    if (isNaN(amount) || amount <= 0 || amount > 99999999) {
        resultBox.style.display = 'none';
        return;
    }

    const currentPair = pairSelect.value;
    if (!ALLOWED_PAIRS.has(currentPair)) {
        showError('Par de moedas inválido ou não suportado.');
        return;
    }

    errorBox.style.display = 'none';
    loader.style.display = 'block';

    currentFetchController = new AbortController();

    try {
        const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${encodeURIComponent(currentPair)}`, {
            signal: currentFetchController.signal,
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const apiKeyName = currentPair.replace('-', '');

        if (!data[apiKeyName] || !data[apiKeyName].bid) {
            throw new Error('Formato de resposta inesperado da API');
        }

        const rate = parseFloat(data[apiKeyName].bid);
        if (isNaN(rate)) throw new Error('Cotação inválida');

        const [fromCurrency, toCurrency] = currentPair.split('-');
        const convertedValue = amount * rate;

        const toConfig = CURRENCY_LOCALES[toCurrency] || { locale: 'pt-BR', currency: toCurrency };
        const fromConfig = CURRENCY_LOCALES[fromCurrency] || { locale: 'en-US', currency: fromCurrency };

        const formatterTo = new Intl.NumberFormat(toConfig.locale, { style: 'currency', currency: toConfig.currency });

        // Atualização segura do DOM com textContent (Prevenção de XSS)
        document.getElementById('resultValue').textContent = formatterTo.format(convertedValue);
        document.getElementById('resultRate').textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;

        resultBox.style.display = 'block';
    } catch (err) {
        if (err.name === 'AbortError') return; // Requisição cancelada intencionalmente
        
        console.error('Erro na conversão:', err);
        showError('Não foi possível obter a cotação. Verifique sua conexão ou tente novamente.');
        resultBox.style.display = 'none';
    } finally {
        loader.style.display = 'none';
    }
}

/**
 * Busca cotações rápidas para a tabela do painel
 */
async function fetchQuickRates() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL');
        if (!response.ok) return;

        const data = await response.json();
        const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        if (data.USDBRL) document.getElementById('rate-USD-BRL').textContent = brlFormatter.format(data.USDBRL.bid);
        if (data.EURBRL) document.getElementById('rate-EUR-BRL').textContent = brlFormatter.format(data.EURBRL.bid);
        if (data.GBPBRL) document.getElementById('rate-GBP-BRL').textContent = brlFormatter.format(data.GBPBRL.bid);
    } catch (e) {
        console.warn('Falha silenciosa ao carregar painel de cotações rápidas.');
    }
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}