import http.client
import json

conn = http.client.HTTPSConnection("api.timeular.com")
payload = json.dumps({
  "apiKey": "{{API_KEY}}",
  "apiSecret": "{{API_SECRET}}"
})
headers = {
  'Content-Type': 'application/json'
}
conn.request("POST", "/api/v3/developer/sign-in", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
###Create an Activity
conn = http.client.HTTPSConnection("api.timeular.com")
payload = json.dumps({
  "name": "sleeping",
  "color": "#a1b2c3",
  "integration": "zei",
  "spaceId": "123456"
})
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer '
}
conn.request("POST", "/api/v3/activities", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
