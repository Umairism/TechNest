import os

file_path = r"d:\Github\Shahzad-Bahi-Idea\app\checkout\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Fix the specific router push line
text = text.replace(r"router.push(\/order-tracking/\\);", "router.push(`/order-tracking/${orderId}`);")

# Fix the returnUrl lines. From previous grep, they looked like: returnUrl: \\/checkout/payment-callback\,
# Note the trailing comma might be inside or outside or missing.
# Let's use a more general replacement for the pattern observed.
text = text.replace(r"\\/checkout/payment-callback\\", "`${window.location.origin}/checkout/payment-callback`")
text = text.replace(r"\\/checkout/payment-callback\,", "`${window.location.origin}/checkout/payment-callback`,")

# Fix button text: \Place Order - \\
text = text.replace(r"\Place Order - \\", "`Place Order - Rs. ${total.toLocaleString()}`")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)
