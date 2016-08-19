imageName="starhackit/api"
projectName="starhackit"
publicPort=9000
url="http://localhost:$publicPort"

# Kills all running containers of an image and then removes them.
cleanAll () {
  if [[ -z $ENVIRONMENT ]]; then
    ENVIRONMENT="debug"
  fi

  composeFileName="docker-compose.yml"
  if [[ $ENVIRONMENT != "release" ]]; then
    composeFileName="docker-compose.$ENVIRONMENT.yml"
  fi

  if [[ ! -f $composeFileName ]]; then
    echo "$ENVIRONMENT is not a valid parameter. File '$composeFileName' does not exist."
  else
    docker-compose -f $composeFileName -p $projectName down --rmi all

    # Remove any dangling images (from previous builds)
    danglingImages=$(docker images -q --filter 'dangling=true')
    if [[ ! -z $danglingImages ]]; then
      docker rmi -f $danglingImages
    fi
  fi
}

# Builds the Docker image.
buildImage () {
  if [[ -z $ENVIRONMENT ]]; then
    ENVIRONMENT="debug"
  fi

  composeFileName="docker-compose.yml"
  if [[ $ENVIRONMENT != "release" ]]; then
    composeFileName="docker-compose.$ENVIRONMENT.yml"
  fi

  if [[ ! -f $composeFileName ]]; then
    echo "$ENVIRONMENT is not a valid parameter. File '$composeFileName' does not exist."
  else
    echo "Building the image $imageName ($ENVIRONMENT)."
    docker-compose -f $composeFileName -p $projectName build
  fi
}

# Runs docker-compose.
compose () {
  if [[ -z $ENVIRONMENT ]]; then
    ENVIRONMENT="debug"
  fi

  composeFileName="docker-compose.yml"
  if [[ $ENVIRONMENT != "release" ]]; then
      composeFileName="docker-compose.$ENVIRONMENT.yml"
  fi

  if [[ ! -f $composeFileName ]]; then
    echo "$ENVIRONMENT is not a valid parameter. File '$composeFileName' does not exist."
  else
    echo "Running compose file $composeFileName"
    docker-compose -f $composeFileName -p $projectName kill
    docker-compose -f $composeFileName -p $projectName up -d
  fi
}

openSite () {
  printf 'Opening site'
  until $(curl --output /dev/null --silent --head --fail $url); do
    printf '.'
    sleep 1
  done

  # Open the site.
  open $url
}

# Shows the usage for the script.
showUsage () {
  echo "Usage: dockerTask.sh [COMMAND] (ENVIRONMENT)"
  echo "    Runs build or compose using specific environment (if not provided, debug environment is used)"
  echo ""
  echo "Commands:"
  echo "    build: Builds a Docker image ('$imageName')."
  echo "    compose: Runs docker-compose."
  echo "    clean: Removes the image '$imageName' and kills all containers based on that image."
  echo "    composeForDebug: Builds the image and runs docker-compose."
  echo ""
  echo "Environments:"
  echo "    debug: Uses debug environment."
  echo "    release: Uses release environment."
  echo ""
  echo "Example:"
  echo "    ./dockerTask.sh build debug"
  echo ""
  echo "    This will:"
  echo "        Build a Docker image named $imageName using debug environment."
}

if [ $# -eq 0 ]; then
  showUsage
else
  case "$1" in
    "compose")
            ENVIRONMENT=$(echo $2 | tr "[:upper:]" "[:lower:]")
            compose
            openSite
            ;;
    "composeForDebug")
            ENVIRONMENT=$(echo $2 | tr "[:upper:]" "[:lower:]")
            export REMOTE_DEBUGGING=1
            buildImage
            compose
            ;;
    "build")
            ENVIRONMENT=$(echo $2 | tr "[:upper:]" "[:lower:]")
            buildImage
            ;;
    "clean")
            ENVIRONMENT=$(echo $2 | tr "[:upper:]" "[:lower:]")
            cleanAll
            ;;
    *)
            showUsage
            ;;
  esac
fi