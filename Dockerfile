FROM n8nio/n8n:latest

USER root

# Create the custom nodes directory inside the n8n data folder
RUN mkdir -p /home/node/.n8n/custom/  # <--- THIS STEP MUST BE PRESENT AND EXECUTE

# Copy your compiled custom nodes into the custom directory
COPY ./custom_nodes_stg/ /home/node/.n8n/custom/ # <--- THIS STEP MUST BE PRESENT AND EXECUTE

# Copy entrypoint.sh and make it executable while still as root
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Now switch to node user for subsequent operations and running the app
USER node

WORKDIR /home/node/packages/cli
ENTRYPOINT []

CMD ["/entrypoint.sh"]
