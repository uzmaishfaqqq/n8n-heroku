#!/bin/sh

echo "🚀 Starting n8n with custom WhatsApp nodes..."

# Optional: run prelaunch scripts or compile if needed
# e.g., npm run build if you want to compile TypeScript

# Launch n8n


# check if PORT variable is set or go with default
if [ -z "${PORT+x}" ]; then
  echo "PORT variable not defined, leaving N8N to default port.";
else
  export N8N_PORT="$PORT";
  echo "N8N will start on '$PORT'";
fi

# kickstart n8n
exec n8n
