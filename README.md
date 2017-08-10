# wcm-solr-module-am

This module gives you the opportunity to index items in Apache Solr.

## Prerequisites
 - A running implementation of the Pelorus CMS is needed either locally or on a server.
 (see https://github.com/hvperdrive/pelorus-cms)
 - Node needs to be installed on the system.
 (see https://nodejs.org)
 - Gulp needs to be installed globally on the system (npm i gulp -g).

## How to install
1. Clone or download the zip of this repository.
2. Run "npm install" in the main folder directory.
3. Run "gulp build" in the main folder directory.
4. Upload the zip created by previous steps (located in the "dist" folder).

## Usage

### API
There is no API available.

### Implementation

#### ArcGIS urls
1. Add all the required settings  
    1.1. Go to modules  
    1.2. Edit the Solr module  
    1.3. Under __Variables__ open the __Solr__  
    1.4. Enter data for all available fields  
    1.5. Save the module  
2. Every project (for AM) will be indexed and updated automatically upon saving or deleting projects.

## Module development

Please read the following on how to work with WCM modules before changing anything to this repo.

[Modules manual](https://github.com/hvperdrive/pelorus-cms/blob/develop/readmes/modules.md)
