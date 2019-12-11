library identifier: 'JenkinsShared@master', retriever: modernSCM([
	$class: 'GitSCMSource',
	remote: 'https://github.com/bshishov/JenkinsShared.git'
])

pipeline {
	agent {		
		docker { 
			image 'node:8-alpine' 
			label 'master'  // Jenkins node to run this build on
		}
	}
	environment {
		NAME = 'hcidb'
		NEXUS_URL = "https://nexus.shishov.me"
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
				BUILD_FILENAME = "${env.NAME}_${env.BRANCH_NAME}.zip"
			}
			steps {
				zipDirectory directory: "dist", file: env.BUILD_FILENAME
				uploadToNexus3(
					filename: env.BUILD_FILENAME, 
					nexusUrl: env.NEXUS_URL,
					targetFilename: "${env.NAME}/${env.BUILD_FILENAME}",
					credentialsId: 'nexus-publish')
			}
		}
	}
}