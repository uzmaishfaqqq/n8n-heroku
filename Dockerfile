FROM n8nio/n8n:latest

# Become root to install files
USER root

# Create directory for custom nodes
RUN mkdir -p /home/node/.n8n/custom/

# Copy your custom WhatsApp node code
COPY ./whatsapp-web-nodes/ /home/node/.n8n/custom/whatsapp-web-nodes/

# Set correct permissions
RUN chmod -R 755 /home/node/.n8n/custom/whatsapp-web-nodes/

# Copy custom entrypoint script
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy package.json that registers the custom nodes
COPY ./package.json /home/node/.n8n/package.json

# Switch back to node user
USER node

# Set working directory (important!)
WORKDIR /home/node/

# Final command
CMD ["/entrypoint.sh"]
