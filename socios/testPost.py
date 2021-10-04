import requests  
import json
url = "http://127.0.0.1:8000/postSocio/"
data = { "data": [{
        "numeroSocio": "568",
        "nombre": "Antonio",
        "apellidos": "prueba",
        "saldo": "20",
        "email": "prueba1234@gmail.com",
        "estado": "Renovado",
        "dentro": "false",
        "enviarMail": "false",
        "DNI": "29598778X"
}]
} 
headers = {'content-type': 'application/json'}
r=requests.post(url, data=json.dumps(data), headers=headers)
print(r.text)
