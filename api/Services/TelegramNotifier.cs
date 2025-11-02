using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace MistoGO.Services
{
    public class TelegramNotifier
    {
        private readonly string _botToken = "8240574480:AAGieRr74NWkLhCtXbRYNeLZFJQPodEDc_o"; // 🔸 заміни на свій токен
        private readonly string _chatId = "739291248";     // 🔸 заміни на свій chat_id

        public async Task SendAsync(string message)
        {
            try
            {
                using var client = new HttpClient();
                var url = $"https://api.telegram.org/bot{_botToken}/sendMessage?chat_id={_chatId}&text={Uri.EscapeDataString(message)}&parse_mode=HTML";

                var resp = await client.GetStringAsync(url);
                Console.WriteLine($"📤 Telegram send result: {resp}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Telegram error: {ex.Message}");
            }
        }
    }
}

