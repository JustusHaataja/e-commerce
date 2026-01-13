import requests

BASE_URL = "http://127.0.0.1:8000"

session = requests.Session()  # handles cookies automatically

# 1: Register a new user
register_data = {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
}
resp = session.post(f"{BASE_URL}/auth/register", json=register_data)
print("Status code:", resp.status_code)
print("Register:", resp.json())

# 2: Create a guest cart item (not logged in yet)
guest_add_data = {"product_id": 65, "quantity": 2}
resp = session.post(f"{BASE_URL}/cart/add", params=guest_add_data)
print("Guest add to cart:", resp.json())

# Save the guest_id cookie for later
guest_id = session.cookies.get("guest_id")
print("Guest ID cookie:", guest_id)

# 3: Login as the registered user and merge guest cart
login_data = {
    "email": "alice@example.com",
    "password": "password123",
    "guest_id": guest_id
}
resp = session.post(f"{BASE_URL}/auth/login", json=login_data)
print("Login:", resp.json())

# 4: Verify merged cart for logged-in user
resp = session.get(f"{BASE_URL}/cart")
print("User cart after merge:", resp.json())

# 5: List products (with optional pagination/filtering)
params = {"skip": 0, "limit": 5}
resp = session.get(f"{BASE_URL}/products", params=params)
# print("Products:", resp.json())

# 6: Add another product to user cart
add_data = {"product_id": 70, "quantity": 1}
resp = session.post(f"{BASE_URL}/cart/add", params=add_data)
print("Add product to user cart:", resp.json())

# 7: View updated cart
resp = session.get(f"{BASE_URL}/cart")
print("Updated cart:", resp.json())
