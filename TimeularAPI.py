#Items needed for import to allow for project to work
import http.client
import json
####
#Start Authentication
####
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
