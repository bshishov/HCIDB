library identifier: 'JenkinsShared@master', retriever: modernSCM([
	$class: 'GitSCMSource',
	remote: 'https://github.com/bshishov/JenkinsShared.git'
])

pipeline {
	agent {
		docker {
			image 'node:8-jessie-slim' 
			label 'master'  // Jenkins node to run this build on
		}
	}
	environment {
		NAME = 'hcidb'
	}
	stages {
		stage('Build') {			
			steps {
				sh 'npm install --progress=false'
				sh 'npm run build'
			}
		}
		stage('Publish to Nexus') {			
			environment {
				BUILD_FILENAME = "${env.NAME}_${env.BRANCH_NAME}.tar.gz"
				NEXUS_URL = 'https://nexus.shishov.me'
			}
			steps {
				sh "tar czvf ${env.BUILD_FILENAME} -C ./dist ."					
				uploadToNexus3(
					filename: env.BUILD_FILENAME, 
					nexusUrl: env.NEXUS_URL,
					repository: 'releases',
					targetFilename: "${env.NAME}/${env.BUILD_FILENAME}",
					credentialsId: 'nexus-publish')
			}
		}
	}
}