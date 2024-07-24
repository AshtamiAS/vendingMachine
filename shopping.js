document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const popupForm = document.getElementById('popupForm');
    const closeButton = document.getElementById('closeButton');
    const productNameField = document.getElementById('productName');
    const productQuantityField = document.getElementById('productQuantity');
    const productPriceField = document.getElementById('productPrice');
    const numberOfItemsField = document.getElementById('numberOfItems');
    const totalPriceField = document.getElementById('totalPrice');
    const userAmountField = document.getElementById('userAmount');
    const confirmAmountButton = document.getElementById('confirmAmount');
    const productForm = document.getElementById('productForm');
    let cartItems = [];
    let userAmount = 0;

    confirmAmountButton.addEventListener('click', () => {
        userAmount = parseFloat(userAmountField.value);
        if (isNaN(userAmount) || userAmount <= 0) {
            alert('Please enter a valid amount.');
        } else {
            alert(`Amount confirmed: ${userAmount}`);
            userAmountField.disabled = true;
            confirmAmountButton.disabled = true;
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.item');
            const productName = item.querySelector('.name').textContent.split(': ')[1];
            const productQuantity = item.querySelector('.quantity').textContent.split(': ')[1];
            const productPrice = item.querySelector('.price').textContent.split(': ')[1];

            productNameField.value = productName;
            productQuantityField.value = productQuantity;
            productPriceField.value = productPrice;
            numberOfItemsField.value = '';
            totalPriceField.value = '';

            popupForm.style.display = 'block';

            productForm.dataset.currentItem = item.dataset.itemId; // Add item id to form dataset
        });
    });

    closeButton.addEventListener('click', () => {
        popupForm.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == popupForm) {
            popupForm.style.display = 'none';
        }
    });

    numberOfItemsField.addEventListener('input', () => {
        const numberOfItems = parseInt(numberOfItemsField.value);
        const productPrice = parseFloat(productPriceField.value);
        if (!isNaN(numberOfItems) && !isNaN(productPrice)) {
            totalPriceField.value = (numberOfItems * productPrice).toFixed(2);
        } else {
            totalPriceField.value = '';
        }
    });

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const totalPrice = parseFloat(totalPriceField.value);

        if (userAmount < totalPrice) {
            alert('Balance insufficient. You cannot buy this.');
            return;
        }

        const productName = productNameField.value;
        const productQuantity = parseInt(productQuantityField.value);
        const productPrice = parseFloat(productPriceField.value);
        const numberOfItems = parseInt(numberOfItemsField.value);
        const currentItem = document.querySelector(`.item[data-item-id="${productForm.dataset.currentItem}"]`);

        // Update the displayed quantity
        const newQuantity = productQuantity - numberOfItems;
        currentItem.querySelector('.quantity').textContent = `Quantity: ${newQuantity}`;

        cartItems.push({
            productName,
            productQuantity: newQuantity,
            productPrice,
            numberOfItems,
            totalPrice
        });

        if (confirm("Do you want to add more items?")) {
            popupForm.style.display = 'none';
        } else {
            const totalCartPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
            const remainingBalance = userAmount - totalCartPrice;

            if (remainingBalance < 0) {
                alert('Balance insufficient for the total cart amount.');
                cartItems = [];
                userAmountField.disabled = false;
                confirmAmountButton.disabled = false;
                return;
            }

            let billContent = `
<html>
<head>
    <title>Bill</title>
    <style>
        body {
            height: 100vh;
            margin: auto;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .bill-container {
            border: 1px dashed #000;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 50%;
            text-align: center;
            margin:auto;
        }
        .bill-header {
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .bill-header h1 {
            margin: 0;
            font-size: 28px;
        }
        .bill-item {
            text-align: left;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .bill-item p {
            margin: 5px 0;
            font-size: 16px;
        }
        .total-amount,
        .amount-provided,
        .remaining-balance {
            font-weight: bold;
            font-size: 18px;
            margin: 10px 0;
        }
        .bill-footer {
            border-top: 2px solid #000;
            margin-top: 20px;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="bill-container">
        <div class="bill-header">
            <h1>Bill</h1>
        </div>`;

            cartItems.forEach(item => {
                billContent += `
        <div class="bill-item">
            <p>Product Name: ${item.productName}</p>
            <p>Quantity Available: ${item.productQuantity}</p>
            <p>Price per Item: ${item.productPrice}</p>
            <p id="number">Number of Items: ${item.numberOfItems}</p>
            <p>Total Price: ${item.totalPrice}</p>
        </div>`;
            });

            billContent += `
        <div class="total-amount">
            <p>Total Amount: ${totalCartPrice.toFixed(2)}</p>
        </div>
        <div class="amount-provided">
            <p>Amount Provided: ${userAmount}</p>
        </div>
        <div class="remaining-balance">
            <p>Remaining Balance: ${remainingBalance.toFixed(2)}</p>
        </div>
        <div class="bill-footer">
            <p>Thank you for your purchase!</p>
        </div>
    </div>
</body>
</html>`;
            let billWindow = window.open('', '_blank');
            billWindow.document.write(billContent);
            billWindow.document.close();
            popupForm.style.display = 'none';
            cartItems = [];
        }
    });
});
