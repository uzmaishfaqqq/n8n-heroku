FROM n8nio/n8n:latest # Or a specific version if you prefer, like 1.48.0

USER root

# Create the base custom nodes directory
RUN mkdir -p /home/node/.n8n/custom/

# Copy your custom node package into a *subdirectory* under /home/node/.n8n/custom/
# The last part of the path must match the name of the package (e.g., whatsapp-web-nodes)
COPY ./whatsapp-web-nodes/ /home/node/.n8n/custom/whatsapp-web-nodes/

# Set appropriate permissions for the copied custom nodes
RUN chmod -R 755 /home/node/.n8n/custom/whatsapp-web-nodes/

# Copy entrypoint.sh and make it executable while still as root
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Now switch to node user for subsequent operations and running the app
USER node

WORKDIR /home/node/packages/cli
ENTRYPOINT []

CMD ["/entrypoint.sh"]
