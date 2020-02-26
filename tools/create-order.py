import requests
import json

url = "http://localhost:3000/api/order/create"

def create_order(order):
    payload = json.dumps(order)
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text.encode('utf8'))


if __name__ == '__main__':
    for id in range(1, 20):
        order = {
            "id": str(id),
            "name": "防护服" + str(id),
            "client": "武汉市红十字会",
            "receiver": "解贝",
            "source": "武汉会展中心",
            "destination": "珞瑜路152号 华中师范大学",
            "description": "一次性防护服 官员专用"
        }
        create_order(order)
        
